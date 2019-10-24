from flask_script import Manager, Server
from fs.init_app import app
from fs.api import api


# 挂上app
api.bind_app(app)

# 以下是启动参数
manager = Manager(app)


@manager.command
def crawling01():
    """1号爬虫,网站为https://socks5.pro"""
    from fs.command import crawling01
    crawling01.main()


manager.add_command('runserver', Server(port=8081, host='0.0.0.0'))


if __name__ == '__main__':
    manager.run()
