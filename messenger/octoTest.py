from octorest import OctoRest

url = "http://klipperO.local"


def make_client():
    try:
        client = OctoRest(url=url, apikey="YouShallNotPass")
        if client is None:
            raise Exception("client is None")
        return client
    except Exception as e:
        print(e)
        exit(1)


def get_version():
    client = make_client()
    message = "You are using OctoPrint v" + client.version['server'] + "\n"
    return message


def get_printer_info():
    try:
        client = OctoRest(url=url, apikey="YouShallNotPass")
        message = ""
        message += str(client.version) + "\n"
        message += str(client.job_info()) + "\n"
        printing = client.printer()['state']['flags']['printing']
        if printing:
            message += "Currently printing!\n"
        else:
            message += "Not currently printing...\n"
        return message
    except Exception as e:
        print(e)


def main():
    c = make_client()
    for k in c.files()['files']:
        print(k['name'])

    with open("./test.stl") as f:
        c.upload(f)


if __name__ == "__main__":
    main()
