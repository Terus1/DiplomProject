git clone https://github.com/Terus1/DiplomProject.git
cd backend

python -m venv venv
source venv/bin/activate  # MacOS/Linux
venv\Scripts\activate  # Windows

pip install -r backend/requirements.txt 

python backend/manage.py migrate
python backend/manage.py runserver


cd frontend
npm install
npm start
