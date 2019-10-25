import redis
from . import config

redis_db = redis.Redis(host=config.REDIS_HOST, port=config.REDIS_PORT, decode_responses=True)
