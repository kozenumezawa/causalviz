import json
import falcon
import corr_analysis
import dummy_response
import lag_analysis

class CorrClass(object):
    # def on_get(self, req, resp):
    def on_post(self, req, resp):
        body = json.loads(req.stream.read().decode('utf-8'))
        # msg = corr_analysis.cross_corr_analysis(body['data'], body['max_lag'], body['win_pixels'], body['win_frames'], body['width'], body['height'])
        msg = dummy_response.cross_corr_analysis(body['data'], body['max_lag'], body['win_pixels'], body['win_frames'], body['width'], body['height'])
        resp.body = json.dumps(msg)
        resp.status = falcon.HTTP_200

class LagClass(object):
    def on_post(self, req, resp):
        body = json.loads(req.stream.read().decode('utf-8'))
        msg = lag_analysis.lag_analysis(body['data'], body['criteria_time_series'], body['win_frames'], body['max_lag'])
        resp.body = json.dumps(msg)
        resp.status = falcon.HTTP_200

class CORSMiddleware:
    def process_request(self, req, resp):
        resp.set_header('Access-Control-Allow-Origin', '*')
        resp.set_header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

api = falcon.API(middleware=[CORSMiddleware()])

api.add_route('/api/v1/corr', CorrClass())
api.add_route('/api/v1/lag', LagClass())

if __name__ == "__main__":
    from wsgiref import simple_server
    httpd = simple_server.make_server("127.0.0.1", 3000, api)
    httpd.serve_forever()
