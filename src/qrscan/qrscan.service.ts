import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQrscanDto } from './dto/create-qrscan.dto';
import { UpdateQrscanDto } from './dto/update-qrscan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Qrscan } from './entities/qrscan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QrscanService {
  private readonly apiKey = process.env.G_API_KEY;
  private isScanning = false; // Bandera para controlar las solicitudes

  constructor(
    @InjectRepository(Qrscan)
    private readonly QrScanRepository: Repository<Qrscan>,
  ) {}

  create(createQrscanDto: CreateQrscanDto) {
    return 'This action adds a new qrscan';
  }

  async scan(qrscanDto: CreateQrscanDto) {
    if (this.isScanning) {
      console.warn("Ya hay una solicitud en proceso.");
      return { message: "Solicitud ya en proceso." };
    }

    this.isScanning = true; // Establecer la bandera como "ocupado"
    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${this.apiKey}`;
    const body = {
      client: {
        clientId: "newagent-fdbea",
        clientVersion: "1.5.2",
      },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
        platformTypes: ["WINDOWS"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ "url": qrscanDto.url }],
      },
    };

    console.log(endpoint)
    console.log(body)

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log(response)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Object.keys(data).length === 0) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      throw error;
    } finally {
      this.isScanning = false; // Liberar la bandera al finalizar
    }
  }

  findAll() {
    return `This action returns all qrscan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} qrscan`;
  }

  findOneByUrl(url: string) {
    return this.QrScanRepository.findBy({ url });
  }

  update(id: number, updateQrscanDto: UpdateQrscanDto) {
    return `This action updates a #${id} qrscan`;
  }

  remove(id: number) {
    return `This action removes a #${id} qrscan`;
  }
}
