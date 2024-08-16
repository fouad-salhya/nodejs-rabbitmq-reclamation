import amqp, { Connection, Channel } from 'amqplib';


class RabbitMqService {

  private connection!: Connection;
  private channel!: Channel;
  private readonly queue = 'userQueue'

  async connect() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queue, { durable: true ,  arguments: { 'x-queue-type': 'quorum' }});
  }

  async sendUserId(userId: string) {
    this.channel.sendToQueue(this.queue, Buffer.from(userId), { persistent: true });
    console.log(`Message sent to ${this.queue}: ${userId}`);
  }

  async close() {
    await this.channel.close();
    await this.connection.close()
  }

  async receiveMessages(callback: (userId: string) => void) {
    this.channel.consume(this.queue, (userId) => {
      if (userId) {
        console.log(`Received: ${userId.content.toString()}`);
        callback(userId.content.toString());
        this.channel.ack(userId);
      }
    });
  }


}

export const rabbitMQService = new RabbitMqService();