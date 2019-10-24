import requests
import re


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

	proxies = []
	for proxy in socks5_list:
		proxies.append({"http":"socks5://"+proxy, "https":"socks5://"+proxy})

	for proxy in proxies:
		try:
			rep = requests.get("http://myip.ipip.net", proxies=proxy, timeout=5)
			if rep.status_code == 200:
				print(proxy)
		except:
			print("timeout")

def main():
	scan()
	check()
