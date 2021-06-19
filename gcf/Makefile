# Assumes GNU make
FILE := key.txt
FAASPROXY_KEY :=$(file < $(FILE))

deploy:
	gcloud functions deploy faasproxy\
		--runtime python39 --trigger-http --allow-unauthenticated\
		--set-env-vars FAASPROXY_KEY="${FAASPROXY_KEY}"
