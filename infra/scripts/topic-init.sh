#!/bin/bash

# Kafka broker address
BOOTSTRAP_SERVER=kafka-service:9092

# Array of topics to create
TOPICS=(
  "ticket-created"
  "ticket-updated"
  "order-created"
  "order-cancelled"
  "expiration-complete"
  "payment-created"
)

# Define namespace and label selector
NAMESPACE=default
LABEL_SELECTOR=app=kafka

# Get the first Kafka pod name
POD_NAME=$(kubectl get pod -n $NAMESPACE -l $LABEL_SELECTOR -o jsonpath='{.items[0].metadata.name}')

# Debugging: Print the pod name
echo "Pod Name: $POD_NAME"

# Check if we retrieved a pod name
if [ -z "$POD_NAME" ]; then
  echo "No Kafka pod found or label selector is incorrect"
  exit 1
fi

# Correct path to kafka-topics.sh
KAFKA_TOPICS_PATH="/usr/bin/kafka-topics"

# Function to create a Kafka topic
create_topic() {
  local TOPIC=$1
  kubectl exec -n $NAMESPACE $POD_NAME -- $KAFKA_TOPICS_PATH --create --topic "$TOPIC" --bootstrap-server "$BOOTSTRAP_SERVER" --partitions 3 --replication-factor 1 || echo "Topic $TOPIC already exists"
}

# Iterate over the topics array and create each topic in the background
for TOPIC in "${TOPICS[@]}"; do
  create_topic "$TOPIC" &
done

# Wait for all background processes to complete
wait
