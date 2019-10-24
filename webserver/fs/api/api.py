from flask_restful import Api


def bind_app(app):
    api = Api(app)

    from . import welcome
    api.add_resource(welcome.Index, '/api/welcome')

	from . import proxy
	api.add_resource(proxy.ProxyList, '/api/proxylsit')
