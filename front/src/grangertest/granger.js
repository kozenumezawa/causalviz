function grangerTest(/*double[]*/A, /*double[]*/B, /*int*/lag) {
        if (A.length > B.length) {
            A = A.slice(0, B.length);
        } else if (B.length > A.length) {
            B = B.slice(0, A.length);
        }

    var k = lag; //回帰する期間
    var DATA_NUM = 2; //変量数
    var T=A.length;// F検定で使用するT（データ数を取得）

        var/*double[][]*/ y = [A, B];

        if (A.length <= lag) {
            throw new Error("ERROR! Data length is too few.");
        }

        log("creating matrix.");

        var/*double[][][]*/ ydiff = getDiffData(y); //t-kの添字の場合のtに当たるデータの作成(k,j,t)
        var /*Matrix*/ X = getMatOfObservedValue(ydiff); //制約なしの場合の観測値行列
        var /*Vector*/ Y = getVecOfY(y); //被説明変数ベクトル
        var /*Matrix*/ Xt = X.t(); // 転置
        var /*Matrix*/ tmp1 = (Xt.mmul(X)).inv();
        var /*Matrix*/ tmp2 =  Xt.mmul(Y);
        var /*Vector*/ beta = tmp1.mmul(tmp2).toVec();

        //制約ありの場合の係数ベクトルの作成
        var/*Vector*/ betaForCnstr = makeBetaForCnstr(beta)

        //制約ありの場合と制約無しの場合の予測値の計算
        log("getting prediction data.");

        var/*Vector*/ yhat = X.mmul(beta).toVec(); //縦ベクトル
        var/*Vector*/ yhatWithCnstr = X.mmul(betaForCnstr).toVec(); //縦ベクトル

        log("got prediction data.");

        // ここからSSR(残差)の計算
        var/*double*/ SSR1 = calcSSR(Y, yhat); //制約無しの場合の残差
        var/*double*/ SSR0 = calcSSR(Y, yhatWithCnstr); //線形制約ありの場合の残差

        //Granger testの実施
        var/*double*/ p = test(SSR1, SSR0, T);

        log("A → Bの因果:"+(p < 0.05));

        log("Done.");

        return p;
//    };

    // 観測値行列の作成
    function /*double[][]*/ getMatOfObservedValue(/*double[][][]*/ ydiff){
        var/*int*/ colNum = (k*DATA_NUM+1)*DATA_NUM;
        var/*int*/ rowNum = ydiff[ydiff.length-1][0].length*DATA_NUM; //maxの階差の時系列データ分.(T-k)*2個のデータ
        var/*int*/ t_max = ydiff[ydiff.length-1][0].length;
        var /*Matrix*/ res = Matrix.create(rowNum, colNum, 0);

        var/*int*/ block = DATA_NUM; //blockの大きさ
        for(var/*int*/ t=0; t<t_max; t++){
            // ブロック毎にデータを作成する
            for(var/*int*/ i=0; i<k; i++){ // 階差分横にブロックを作成
                for(var/*int*/ l=0; l<DATA_NUM; l++){
                    for(var /*int*/ j=0; j<DATA_NUM; j++){ //データの個数分の縦横の正方行列の作成
                        res[block*t+j][block*block*i+l*block+j] = ydiff[i][l][t];
                    }
                }
            }
            // 定数部分を追加
            for(var/*int*/ j=0; j<DATA_NUM; j++){
                res[block*t+j][block*block*k+j] = 1;
            }
        }   
        return res;
    }

    // 制約を課したモデル用の観測データ作成
    function /*Matrix*/ getMatOfObservedValueForConstraint(/*double[][][]*/ ydiff){
        var/*int*/ colNum = (k*DATA_NUM+1)*DATA_NUM;
        var/*int*/ rowNum = ydiff[ydiff.length-1][0].length*DATA_NUM; //maxの階差の時系列データ分.(T-k)*2個のデータ
        var/*int*/ t_max = ydiff[ydiff.length-1][0].length;
        var/*Matrix*/ res = Matrix.create(rowNum, colNum, 0);

        var/*int*/ block = DATA_NUM; //blockの大きさ
        for(var/*int*/ t=0; t<t_max; t++){
            // ブロック毎にデータを作成する
            for(var/*int*/ i=0; i<k; i++){ // 階差分横にブロックを作成
                for(var/*int*/ l=0; l<DATA_NUM; l++){
                    for(var/*int*/ j=0; j<DATA_NUM; j++){ //データの個数分の縦横の正方行列の作成
                        if(l==j){ // 他者との関わりのある係数を除く
                            res[block*t+j][block*block*i+l*block+j] = ydiff[i][l][t];
                        }else{
                            continue;
                        }
                    }
                }
            }
            // 定数部分を追加
            for(var/*int*/ j=0; j<DATA_NUM; j++){
                res[block*t+j][block*block*k+j] = 1;
            }
        }   
        return res;
    }

    // yの値を集約したベクトルの作成
    function /*double[]*/ getVecOfY(/*double[][]*/ y){
        var/*int*/ t_max = y.length*y[0].length-k*y.length;

        var/*Vector*/ res = Vector.create(t_max, 0, Vector.COL);

        for(var/*int*/ t=k; t<y[0].length; t++){
            for(var/*int*/ i=0; i<y.length; i++){
                res[(t-k)*y.length+i] = y[i][t];
            }
        }
        return res;
    }

    //SSRの算出
    function /*double*/ calcSSR(/*Vector*/ y, /*Vector*/ yhat){
        var /*double*/ res = 0;
        var /*int*/i = 1;
        for(var/*int*/ t=0; t<y.length/DATA_NUM; t++){
            res += Math.pow( yhat[i+t*DATA_NUM]-y[i+t*DATA_NUM], 2 );
        }
        return res;
    }

    //グレンジャーtest
    function /*double*/ test(/*double*/ SSR1, /*double*/ SSR0, /*int*/ T){
        var /*int*/ m1 = k; //自由度m1

        // Fテストの実施
        var/*double*/ fval = Ftest(SSR1, SSR0);
        log("F="+fval+", rF="+(m1*fval));

        var/*double*/ p = jStat.chisquare.pdf(m1 * fval, m1)

        return p;
    }

    //Ftest
    function /*double*/ Ftest(/*double*/ssr1, /*double */ssr0){
        var /*int*/ m1 = k; //自由度m1
        var /*int*/ m2 = T - k*DATA_NUM -1; //自由度m2
        //     (ssr0 - ssr1)/r
        //F = -----------------
        //     ssr1/(T-np-1)
        var result = ( (ssr0 - ssr1) / m1 ) / (ssr1 / m2);
        return result;
    }

    // t-kのデータと掛け合わせるtのデータを作成する
    function /*double[][][]*/ getDiffData(/*double[][]*/ y){
        //t-kの添字の場合のtに当たるデータの作成      
        var /*double[][][]*/ ydiff = []; //double[k][y.length][y[0].length-k];

        for(var /*int*/ i=1; i<=k; i++){
            ydiff[i-1] = [];
            for(var /*int*/ j=0; j<y.length; j++){
                ydiff[i-1][j] = [];
                var /*int*/ itr = 0;
                for(var /*int*/ t=k-i; t<y[0].length-i; t++){
                    ydiff[i-1][j][itr] = y[j][t];
                    itr+=1;
                }
            }
        }
        return ydiff;
    }

    // 制約用のbetaベクトルの作成
    function /*Vector*/ makeBetaForCnstr(/*Vector*/ beta){
        var /*int*/ kblock = DATA_NUM*DATA_NUM;
        var /*Vector*/ res = beta.clone();

        for(var /*int*/ ki=0; ki<k; ki++){ //最外層のブロック
            var i = 0; // from
            var j = 1; // to
            res[kblock*ki+i*DATA_NUM+j] = 0;
        }
        return res;
    }

    function log(arg1, arg2) {
//        var arg = arg1;
//        if (arg2 != undefined) {
//            if (typeof(arg2) == "array" || typeof(arg2) == "object") {
//                if ('toArray' in arg2) arg2 = arg2.toArray();
//                var dumper = new JKL.Dumper();
//                arg += dumper.dump(arg2);
//            } else {
//                arg += arg2;
//            }
//        }
//        document.writeln(arg);
    }
}
