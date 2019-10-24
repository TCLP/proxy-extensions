import flask_restful as restful
from fs.utils import format_response


class ProxyList(restful.Resource):
    def get(self):
		return format_response(0, 'success', 'welcome to you')

