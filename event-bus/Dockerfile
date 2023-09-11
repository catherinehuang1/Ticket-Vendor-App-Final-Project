FROM bitnami/kafka:3.3.1

WORKDIR /opt/bitnami/kafka

# We followed this guide for how to set up Kafka using KRaft: https://kafka.apache.org/quickstart

# The line below generates a random cluster UUID and formats the log directories
RUN bin/kafka-storage.sh format -t "$(bin/kafka-storage.sh random-uuid)" -c config/kraft/server.properties

# The line below changes the advertised listener setting from the default setting of localhost:9092 to event-bus:9092
# When a client connects to the Kafka broker, the broker will send back the advertised listener
# When the client gets the advertised listener, it will start listening to the advertised listener instead of the original connection
# So when the original setting was localhost, we ran into an issue where our Kafka clients were trying to connect to themselves on 127.0.0.1
# To fix it, this sed command changes it to event-bus, which is the hostname the Docker network gives the event bus
RUN sed -i 's#PLAINTEXT://localhost:9092#PLAINTEXT://event-bus:9092#g' config/kraft/server.properties

# The line below starts the Kafka broker
CMD ["bin/kafka-server-start.sh", "config/kraft/server.properties"]