def format_response(code, message, data={}):
    ret = {
        "code": code,
        "message": message,
        "data": data
    }
    return ret