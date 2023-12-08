file = [{
    'name': "1.gcode",
    'size': 500
}, {
    'name': "2.gcode",
    'size': 200
}, {
    'name': "3.gcode",
    'size': 300
}]
user = ["user1", "user2"]


def distribute(file, user):
    user = [{"name": i, "size_sum": 0} for i in user]
    result = []
    for i in file:
        user.sort(key=lambda x: x["size_sum"])
        user[0]["size_sum"] += i["size"]
        result.append({"file": i["name"], "user": user[0]["name"]})

    return result


print(distribute(file, user))
