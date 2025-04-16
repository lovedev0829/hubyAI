'''
#--- old code
from huby_vectordb_app import app
if __name__ == "__main__":
	app.run()
'''
import os
from huby_vectordb_app import app

# Worker configuration
workers = int(os.environ.get('GUNICORN_WORKERS', '2'))  # Default to 2 workers
threads = int(os.environ.get('GUNICORN_THREADS', '4'))  # Default to 4 threads

#These settings will be used by gunicorn
bind = '0.0.0.0:5000'
worker_class = 'gthread'  # Use threads for better memory sharing
timeout = 120  # Increase timeout for long-running operations
max_requests = 1000  # Restart workers after this many requests
max_requests_jitter = 50  # Add randomness to restarts
preload_app = True  # Load app code before forking

# Memory limits (in MB)
worker_tmp_dir = '/dev/shm'  # Use shared memory
#max_memory_per_child = 2048  # Restart worker if it uses more than 2GB

def when_ready(server):
    # This runs before workers are forked
    print(f"WSGI Server is ready. Running with {workers} workers and {threads} threads per worker")

def on_starting(server):
    print("WSGI Server is starting...")

if __name__ == "__main__":
    app.run()

