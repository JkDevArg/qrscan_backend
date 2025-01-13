import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQrscanDto } from './dto/create-qrscan.dto';
import { UpdateQrscanDto } from './dto/update-qrscan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Qrscan } from './entities/qrscan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QrscanService {
  private readonly apiKey = process.env.G_API_KEY;
  private readonly google_endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${this.apiKey}`;
  private readonly virus_total_endpoint = `https://www.virustotal.com/api/v3/urls`;
  private isScanning = false;

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

    if (!qrscanDto.url || !this.isValidUrl(qrscanDto.url)) {
      throw new HttpException('URL inválida', HttpStatus.BAD_REQUEST);
    }

    this.isScanning = true;

    try {
      // validamos si ya existe en la base ede datos}
      const formattedUrl = this.getDomain(qrscanDto.url);
      const qrscan = await this.QrScanRepository.findOne({ where: { url: formattedUrl } });
      if (qrscan) {
        console.log(qrscan.url);
        return qrscan.suspicion;
      }

      const googleResponse = await this.checkWithGoogleSafeBrowsing(qrscanDto.url);

      if (googleResponse) {
        //const virusTotalResponse = await this.virus_total(qrscanDto.url);
        await this.saveData(formattedUrl, googleResponse, true);
        return true;
      }

      await this.saveData(formattedUrl, googleResponse, false);
      return false;
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      throw new HttpException(
        'Error durante el escaneo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.isScanning = false;
    }
  }

  async checkWithGoogleSafeBrowsing(url: string) {
    const body = {
      client: {
        clientId: "newagent-fdbea",
        clientVersion: "1.5.2",
      },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
        platformTypes: ["WINDOWS"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url }],
      },
    };

    const response = await this.makeHttpRequest(this.google_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return Object.keys(response).length !== 0;
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

  async virus_total(url: string) {
    const apiKey = process.env.VIRUSTOTAL_API_KEY;

    const options: RequestInit = {
        method: "POST",
        headers: {
            "x-apikey": apiKey,
            "content-type": "application/x-www-form-urlencoded",
            "accept": "pplication/json",
        },
        body: JSON.stringify({ url }),
    };

    try {
        const response = await this.makeHttpRequest(this.virus_total_endpoint, options);
        console.log("Respuesta de VirusTotal:", response);
        return response;
    } catch (error) {
        console.error("Error al consultar VirusTotal:", error);
        throw new HttpException(
            "Error al consultar el servicio de VirusTotal",
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

   /*
   const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      }
    };

    fetch('https://www.virustotal.com/api/v3/urls', options)
      .then(res => res.json())
      .then(res => console.log(res))
      .catch(err => console.error(err));
   
   */
}

  private async makeHttpRequest(endpoint: string, options: RequestInit) {
    try {
      const response = await fetch(endpoint, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      throw new HttpException(
        'Error al realizar la solicitud HTTP',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  private async saveData(url: string, response: any, suspicion: boolean){
    const saveQrScan = this.QrScanRepository.create({
      url: url,
      data: JSON.stringify(response),
      suspicion: suspicion,
    });
    await this.QrScanRepository.save(saveQrScan);
  }

  private getDomain(url: string) {
    let domain = url.replace(/^(https?:\/\/)?(www\.)?/, '');

    domain = domain.split('/')[0];

    return domain;
  }
}

