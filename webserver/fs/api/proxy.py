import flask_restful as restful
from fs.utils import format_response
from fs.init_db import redis_db
import random
import requests

class ProxyList(restful.Resource):
	def get(self):
		pipe = redis_db.pipeline()
		hosts = redis_db.keys('*')
		for host in hosts:
			pipe.get(host)
		ports = pipe.execute()
		# data = dict(zip(hosts, ports))
		
		index = random.randint(0, len(hosts)-1)
		data = {
			"host":str(hosts[index]),
			"port":int(ports[index])
		}
		return format_response(0, 'success', data)



class ProxyList02(restful.Resource):
	def get(self):
		try:
			data = requests.get("https://api.getproxylist.com/proxy", timeout=3)
			return format_response(0, 'success', data.text)
		except:
			return format_response(-1, 'failed', 'request timeout')
