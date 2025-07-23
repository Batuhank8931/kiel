import subprocess

# Open the file containing the URL
with open('/home/user/Desktop/script/url.txt', 'r') as file:
    url = file.read().strip()  # Read and strip any extra whitespace

# Open the URL in Chromium in full-screen mode
subprocess.run([
    'chromium',
    '--noerrdialogs',
    '--disable-session-crashed-bubble',
    '--disable-infobars',
    '--start-fullscreen',
    url
])
