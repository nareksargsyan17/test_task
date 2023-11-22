import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { headersRequest } from 'axiosInstance';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async getByPhoneAndEmail(query: any): Promise<any> {
    const getByPhoneAndEmail = this.httpService.get(
      `${process.env.REQUEST_URL}api/v4/contacts?query=${query.phone}&&query=${query.email}`, 
      headersRequest(process.env.ACCESS_TOKEN)
    );
    const response = await lastValueFrom(getByPhoneAndEmail);
    const contactId = response.data?._embedded?.contacts[0]?.id;

    return contactId;
  }

  async getByContactId(id: string): Promise<any> {
    const getByContactId = this.httpService.get(
      `${process.env.REQUEST_URL}api/v4/contacts/${id}`, 
      headersRequest(process.env.ACCESS_TOKEN)
    );
    const response = await lastValueFrom(getByContactId);

    return response.data;
  }

  async patchContact(id: string,query: any): Promise<any> {
    const data = {
        "name": query.name,
        "custom_fields_values": [
            {
                "field_id": 1509901,
                "field_name": "phone",
                "values": [
                    {
                        "value": query.phone
                    }
                ]
            },
            {
                "field_id": 1509899,
                "field_name": "email",
                "values": [
                    {
                        "value": query.email
                    }
                ]
            }
        ]
    }

    const patchContact = this.httpService.patch(
      `${process.env.REQUEST_URL}api/v4/contacts/${id}`,
      data,
      headersRequest(process.env.ACCESS_TOKEN)
    );
    const response = await lastValueFrom(patchContact);
    const contactId = response.data?.id;

    return contactId;
  } 
  
  async createContact(query: any): Promise<any> {
    const data = [
        {
            "name": query.name,
            "custom_fields_values": [
                {
                    "field_id": 1509901,
                    "field_name": "phone",
                    "values": [
                        {
                            "value": query.phone
                        }
                    ]
                },
                {
                    "field_id": 1509899,
                    "field_name": "email",
                    "values": [
                        {
                            "value": query.email
                        }
                    ]
                }
            ]
        }
    ]

    const createContact = this.httpService.post(
      `${process.env.REQUEST_URL}api/v4/contacts`,
      data,
      headersRequest(process.env.ACCESS_TOKEN)
    );
    const response = await lastValueFrom(createContact);
    const contactId = response.data?._embedded?.contacts[0]?.id;

    return contactId;
  }

  async createLead(id: string): Promise<any> {
    const data = [
      {
          "name": `Lead ${Math.random() * 100}`,
          "price": 1000,
          "_embedded": {
            "contacts": [{ id }]
          }
      },
    ]

    const createLead = this.httpService.post(
      `${process.env.REQUEST_URL}api/v4/leads`,
      data,
      headersRequest(process.env.ACCESS_TOKEN)
    );
    const response = await lastValueFrom(createLead);

    return response.data;
  }


  async getLead(query: any): Promise<any> {
    try {
      const getByPhoneAndEmailId = await this.getByPhoneAndEmail(query);
      if (getByPhoneAndEmailId) {
        const contactId = await this.patchContact(getByPhoneAndEmailId, query);
        return await this.createLead(contactId);
      } else {
        const contactId = await this.createContact(query);
        return await this.createLead(contactId);
      }
    } catch(e) {
      return {
        message: e.message
      }
    }
  }
}
