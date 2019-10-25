import requests
import re
from fs.init_db import redis_db
from fs import config



socks5_list = []

def scan():
	global socks5_list
	pattern = re.compile(r'\d+.\d+.\d+.\d+:\d+')
	base_url = "https://socks5.pro/page/"
	
	try:
		for i in range(2, 10):
			rep = requests.get(base_url + str(i), timeout=10)
			if rep.status_code == 404:
				continue 
			socks5_list += pattern.findall(rep.text)
	except:
		print("timeout")


def check():
	global socks5_list
	for item in socks5_list:
		proxy = {"http":"socks5://"+item, "https":"socks5://"+item}
		try:
			rep = requests.get("http://myip.ipip.net", proxies=proxy, timeout=3)
			if rep.status_code == 200:
				host = item.split(':')[0]
				port = item.split(':')[1]
				print(host, "  :  ", port)
				redis_db.setex(host, config.REDIS_EXPIRES, port)
		except:
			pass

def main():
	scan()
	check()
