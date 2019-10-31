from flask_script import Manager, Server
from fs.init_app import app
from fs.init_db import redis_db
from fs.api import api


# 挂上app
api.bind_app(app)

# 以下是启动参数
manager = Manager(app)


@manager.command
def redis_test():
    """测试redis db"""
    redis_db.setex("testkey", 20, "testvalue")


@manager.command
def crawling01():
    """1号爬虫,数据来源网站为https://socks5.pro,访问测试网站为myip.ipip.net"""
    from fs.command import crawling01
    crawling01.main()


@manager.command
def crawling02():
    """2号爬虫,数据来源网站为https://socks5.pro,访问测试网站为www.google.com"""
    from fs.command import crawling02
    crawling02.main()


@manager.command
def speed_test(ip, port):
	from fs.command import speed_test
	speed_test.main(ip, port)


manager.add_command('runserver', Server(port=8081, host='0.0.0.0'))


if __name__ == '__main__':
    manager.run()
