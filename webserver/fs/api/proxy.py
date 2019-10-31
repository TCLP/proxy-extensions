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
		#index = 0
		#for host in hosts:
		#	index=speed(host) if speed(host) != -1

		data = {
			"host":str(hosts[index]),
			"port":int(ports[index])
		}
		return format_response(0, 'success', data)

	def speed(self, ip, maxies=1, timeout=2):
		cmd = 'ping -c %d -w %d %s' % (maxies, timeout, ip)
		p  =subprocess.Popen(cmd, 
			stdin = subprocess.PIPE,
			stdout = subprocess.PIPE,
			stderr = subprocess.PIPE,
			shell = True
		)
		result = re.findall(b'time=\d{1,4}', p.stdout.read())
		return int(result[0].split(b'=')[1]) if len(result) != 0 else -1


class ProxyList02(restful.Resource):
	def get(self):
		try:
			data = requests.get("https://api.getproxylist.com/proxy", timeout=3)
			return format_response(0, 'success', data.text)
		except:
			return format_response(-1, 'failed', 'request timeout')

