# How to run the frontend

## The simple way

```bash
python3 frontend.py [BACKEND PORT]
```

For example:

```bash
python3 frontend.py 5000
```

The backend port is just an integer that is the port the flask server is CURRENTLY running on.

<hr>

## The complex way

Only complete this step if you're comfortable self-teaching yourself ReactJS.

Run this once on the machine.
```bash
npm install
```

Start up your backend on a specific port.

Then run:
```bash
./run.sh [BACKEND PORT] [FRONTEND PORT]
```

For example:
```bash
./run.sh 5000 12345
```
