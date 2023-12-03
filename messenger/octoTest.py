from octorest import OctoRest
import requests

url = "http://klipperO.local"

def main():

    file = {
        "file": ("bency.gcode", open("messenger/bency.gcode", "rb")),
        "print": "true"
    }
    requests.post(url + "/api/files/local", files=file)


if __name__ == "__main__":
    main()
