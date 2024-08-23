import amqp, { Connection, Channel } from 'amqplib';


class RabbitMqService {

  private connection!: Connection;
  private channel!: Channel;
  private readonly queue = 'userQueue'
  private readonly reclamationQueue = 'reclQueue'; 

  private lastReclamationId: string | null = null;

  async connect() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queue, { durable: true ,  arguments: { 'x-queue-type': 'quorum' }});
    await this.channel.assertQueue(this.reclamationQueue, { durable: true, arguments: { 'x-queue-type': 'quorum' } });
  }

  async sendUserId(userId: string) {
    this.channel.sendToQueue(this.queue, Buffer.from(userId), { persistent: true });
    console.log(`j'ai envoyer userId a springboot ${this.queue}: ${userId}`);
  }


  // Recevoir et mettre à jour la dernière valeur de reclamationId
  async receiveReclamationId(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.channel.consume(this.reclamationQueue, (msg) => {
        if (msg) {
          this.lastReclamationId = msg.content.toString();
          this.channel.ack(msg);
          resolve(this.lastReclamationId);
        } else {
          reject(new Error('No message received'));
        }
      });
    });
  }

  getLastReclamationId(): string | null {
    return this.lastReclamationId;
  }

  async close() {
    await this.channel.close();
    await this.connection.close()
  }


}

export const rabbitMQService = new RabbitMqService();