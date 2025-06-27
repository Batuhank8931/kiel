import subprocess
import threading

def stream_output(pipe, prefix):
    for line in iter(pipe.readline, ''):
        if line:
            print(f"{prefix} {line.strip()}")

def run_npm_command_async(directory, command, prefix):
    process = subprocess.Popen(
        command,
        cwd=directory,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,             # ensures str output, not bytes
        encoding='utf-8',      # decode output as utf-8
        errors='replace'       # replace undecodable bytes with �
    )
    threading.Thread(target=stream_output, args=(process.stdout, prefix), daemon=True).start()
    threading.Thread(target=stream_output, args=(process.stderr, prefix), daemon=True).start()
    return process

if __name__ == "__main__":
    server_dir = r'C:\Users\Batuhan\Desktop\kiel\kiel\server'
    client_dir = r'C:\Users\Batuhan\Desktop\kiel\kiel\client'

    print("Starting server...")
    server_process = run_npm_command_async(server_dir, 'npm start', '[SERVER]')

    print("Starting client...")
    client_process = run_npm_command_async(client_dir, 'npm run dev', '[CLIENT]')

    try:
        while True:
            if server_process.poll() is not None:
                print("[SERVER] process exited.")
                break
            if client_process.poll() is not None:
                print("[CLIENT] process exited.")
                break
    except KeyboardInterrupt:
        print("\nTerminating processes...")
        server_process.terminate()
        client_process.terminate()
