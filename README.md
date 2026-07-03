# 💈 BarberAutomation SaaS

## ⚙️ Backend Setup

```bash
cd Backend
npm install
```

Create `.env` file inside `Backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb+srv://graphuratestingDB:FChgN9ZIZBi5ItdK@graphuratestingdb.v2gcmi8.mongodb.net/BarberAutomation?retryWrites=true&w=majority
JWT_SECRET=graphura_barber_secret_2026
RAZORPAY_KEY_ID=rzp_test_T8xUtChiRhSybU
RAZORPAY_KEY_SECRET=yHzQP7KOZiSdOieA8tTH8KEw
FRONTEND_URL=http://localhost:5173

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=Saloon.graphura@gmail.com
SMTP_PASS=fdvxpdahkvhrqecs
SMTP_FROM="BarberPro" <Saloon.graphura@gmail.com>
GOOGLE_CLIENT_ID=your_google_client_id_here
```

```bash
npm run dev
```

---

## 🎨 Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---

## 🔐 Test Credentials

### 👥 Global Roles
| Role | Mobile / Email | Password / OTP | Notes |
|------|--------|----------|-------|
| **Customer** | Any mobile | OTP shown in UI blue box | Login at `/login` |
| **Admin** | `9000000000` | `Admin@123` | Login at `/admin/login` |
| **Admin MPIN** | — | `123456` | For sensitive actions |

### 🏢 Custom/Manual Test Accounts

#### Salon Owners (Login at `/owner/login`)
All custom salon owner accounts in the database have been set to the password `owner@123` for testing convenience:

| Salon Name | Owner Name | Mobile (Username) | Password |
| :--- | :--- | :--- | :--- |
| **The Royal Blade** | Rahul Kumar | `9999999999` | `owner@123` |
| **Noor Beauty Parlor** | Aarti | `7038959005` | `owner@123` |
| **VanshTest** | vanshmalik | `9674367213` | `owner@123` |
| **Royal cut studio** | vansh malik | `9958765434` | `owner@123` |
| **Vansh** | Vansh | `8506998800` | `owner@123` |
| **vansh** | owner | `7753422424` | `owner@123` |
| **fsefsef** | fsvsf | `9582103293` | `owner@123` |

#### Barbers (Login at `/barber/login`)
All custom barber accounts in the database have been set to the password `Barber@123` for testing convenience:

| Salon Name | Barber Name | Mobile (Username) | Password |
| :--- | :--- | :--- | :--- |
| **Noor Beauty Parlor** | rahul barber | `9506998800` | `Barber@123` |
| **The Royal Blade** | Ali (Master Stylist) | `8888888801` | `Barber@123` |
| **The Royal Blade** | Ravi (Beard Expert) | `8888888802` | `Barber@123` |
| **The Royal Blade** | James (Color Specialist) | `8888888803` | `Barber@123` |
| **The Royal Blade** | Nitin | `7038959005` | `Barber@123` |
| **VanshTest** | Jan aman | `8506998800` | `Barber@123` |
| **Royal cut studio** | piyush sharma | `rahulaggarwal31090@gmail.com` | `Barber@123` |
| **Vansh** | Varsha Singh | `8149328145` | `Barber@123` |
| **vansh** | barber testing | `9999999999` | `Barber@123` |

### 🇮🇳 Seeded Salon Owners & Barbers (from seed_india_salons.js)
The default password for all seeded owner and barber accounts is `password123`.

### 🏢 Seeded Salon Owners (Login at `/owner/login`)
| State | Salon Name | Owner Name | Mobile (Username) | Email | Password |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Andhra Pradesh | **Andhra Pradesh Royal Grooming** | Andhra Pradesh Owner 1 | `9000000001` | `andhrapradeshroyalgrooming@barberpro.com` | `password123` |
| Arunachal Pradesh | **Arunachal Pradesh Elite Cuts** | Arunachal Pradesh Owner 1 | `9000000002` | `arunachalpradeshelitecuts@barberpro.com` | `password123` |
| Assam | **Assam Classic Stylists** | Assam Owner 1 | `9000000003` | `assamclassicstylists@barberpro.com` | `password123` |
| Bihar | **Bihar Barbershop Lounge** | Bihar Owner 1 | `9000000004` | `biharbarbershoplounge@barberpro.com` | `password123` |
| Chhattisgarh | **Chhattisgarh Luxe Studios** | Chhattisgarh Owner 1 | `9000000005` | `chhattisgarhluxestudios@barberpro.com` | `password123` |
| Goa | **Goa Signature Salon** | Goa Owner 1 | `9000000006` | `goasignaturesalon@barberpro.com` | `password123` |
| Gujarat | **Gujarat Imperial Hair Care** | Gujarat Owner 1 | `9000000007` | `gujaratimperialhaircare@barberpro.com` | `password123` |
| Haryana | **Haryana Grand Grooming** | Haryana Owner 1 | `9000000008` | `haryanagrandgrooming@barberpro.com` | `password123` |
| Himachal Pradesh | **Himachal Pradesh Royal Grooming** | Himachal Pradesh Owner 1 | `9000000009` | `himachalpradeshroyalgrooming@barberpro.com` | `password123` |
| Jharkhand | **Jharkhand Elite Cuts** | Jharkhand Owner 1 | `9000000010` | `jharkhandelitecuts@barberpro.com` | `password123` |
| Karnataka | **Karnataka Classic Stylists** | Karnataka Owner 1 | `9000000011` | `karnatakaclassicstylists@barberpro.com` | `password123` |
| Kerala | **Kerala Barbershop Lounge** | Kerala Owner 1 | `9000000012` | `keralabarbershoplounge@barberpro.com` | `password123` |
| Madhya Pradesh | **Madhya Pradesh Luxe Studios** | Madhya Pradesh Owner 1 | `9000000013` | `madhyapradeshluxestudios@barberpro.com` | `password123` |
| Maharashtra | **The Royal Touch Salon** | Ravi (Owner) | `9999999999` | `` | `password123` |
| Maharashtra | **Maharashtra Signature Salon** | Maharashtra Owner 1 | `9000000014` | `maharashtrasignaturesalon@barberpro.com` | `password123` |
| Manipur | **Manipur Imperial Hair Care** | Manipur Owner 1 | `9000000015` | `manipurimperialhaircare@barberpro.com` | `password123` |
| Meghalaya | **Meghalaya Grand Grooming** | Meghalaya Owner 1 | `9000000016` | `meghalayagrandgrooming@barberpro.com` | `password123` |
| Mizoram | **Mizoram Royal Grooming** | Mizoram Owner 1 | `9000000017` | `mizoramroyalgrooming@barberpro.com` | `password123` |
| Nagaland | **Nagaland Elite Cuts** | Nagaland Owner 1 | `9000000018` | `nagalandelitecuts@barberpro.com` | `password123` |
| Odisha | **Odisha Classic Stylists** | Odisha Owner 1 | `9000000019` | `odishaclassicstylists@barberpro.com` | `password123` |
| Punjab | **Punjab Barbershop Lounge** | Punjab Owner 1 | `9000000020` | `punjabbarbershoplounge@barberpro.com` | `password123` |
| Rajasthan | **Rajasthan Luxe Studios** | Rajasthan Owner 1 | `9000000021` | `rajasthanluxestudios@barberpro.com` | `password123` |
| Sikkim | **Sikkim Signature Salon** | Sikkim Owner 1 | `9000000022` | `sikkimsignaturesalon@barberpro.com` | `password123` |
| Tamil Nadu | **Tamil Nadu Imperial Hair Care** | Tamil Nadu Owner 1 | `9000000023` | `tamilnaduimperialhaircare@barberpro.com` | `password123` |
| Telangana | **Telangana Grand Grooming** | Telangana Owner 1 | `9000000024` | `telanganagrandgrooming@barberpro.com` | `password123` |
| Tripura | **Tripura Royal Grooming** | Tripura Owner 1 | `9000000025` | `tripuraroyalgrooming@barberpro.com` | `password123` |
| Uttar Pradesh | **Uttar Pradesh Elite Cuts** | Uttar Pradesh Owner 1 | `9000000026` | `uttarpradeshelitecuts@barberpro.com` | `password123` |
| Uttarakhand | **Uttarakhand Classic Stylists** | Uttarakhand Owner 1 | `9000000027` | `uttarakhandclassicstylists@barberpro.com` | `password123` |
| West Bengal | **West Bengal Barbershop Lounge** | West Bengal Owner 1 | `9000000028` | `westbengalbarbershoplounge@barberpro.com` | `password123` |

### 💈 Seeded Barbers (Login at `/barber/login`)
| Salon Name | Barber Name | Mobile (Username) | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| Andhra Pradesh Royal Grooming | Pranav Barber | `8000000001` | `pranav@andhrapradeshroyalgrooming.com` | `password123` |
| Andhra Pradesh Royal Grooming | Abhishek Barber | `8000000002` | `abhishek@andhrapradeshroyalgrooming.com` | `password123` |
| Andhra Pradesh Royal Grooming | Kabir Barber | `8000000003` | `kabir@andhrapradeshroyalgrooming.com` | `password123` |
| Andhra Pradesh Royal Grooming | Ravi Barber | `8000000004` | `ravi@andhrapradeshroyalgrooming.com` | `password123` |
| Andhra Pradesh Royal Grooming | Sandeep Barber | `8000000005` | `sandeep@andhrapradeshroyalgrooming.com` | `password123` |
| Arunachal Pradesh Elite Cuts | Rohan Barber | `8000000006` | `rohan@arunachalpradeshelitecuts.com` | `password123` |
| Arunachal Pradesh Elite Cuts | Rohit Barber | `8000000007` | `rohit@arunachalpradeshelitecuts.com` | `password123` |
| Arunachal Pradesh Elite Cuts | Anil Barber | `8000000008` | `anil@arunachalpradeshelitecuts.com` | `password123` |
| Arunachal Pradesh Elite Cuts | Reyansh Barber | `8000000009` | `reyansh@arunachalpradeshelitecuts.com` | `password123` |
| Arunachal Pradesh Elite Cuts | Vikram Barber | `8000000010` | `vikram@arunachalpradeshelitecuts.com` | `password123` |
| Assam Classic Stylists | Vihaan Barber | `8000000011` | `vihaan@assamclassicstylists.com` | `password123` |
| Assam Classic Stylists | Vivek Barber | `8000000012` | `vivek@assamclassicstylists.com` | `password123` |
| Assam Classic Stylists | Varun Barber | `8000000013` | `varun@assamclassicstylists.com` | `password123` |
| Assam Classic Stylists | Harsh Barber | `8000000014` | `harsh@assamclassicstylists.com` | `password123` |
| Assam Classic Stylists | Rahul Barber | `8000000015` | `rahul@assamclassicstylists.com` | `password123` |
| Bihar Barbershop Lounge | Anil Barber | `8000000016` | `anil@biharbarbershoplounge.com` | `password123` |
| Bihar Barbershop Lounge | Abhishek Barber | `8000000017` | `abhishek@biharbarbershoplounge.com` | `password123` |
| Bihar Barbershop Lounge | Krishna Barber | `8000000018` | `krishna@biharbarbershoplounge.com` | `password123` |
| Bihar Barbershop Lounge | Karan Barber | `8000000019` | `karan@biharbarbershoplounge.com` | `password123` |
| Bihar Barbershop Lounge | Alok Barber | `8000000020` | `alok@biharbarbershoplounge.com` | `password123` |
| Chhattisgarh Luxe Studios | Gaurav Barber | `8000000021` | `gaurav@chhattisgarhluxestudios.com` | `password123` |
| Chhattisgarh Luxe Studios | Yash Barber | `8000000022` | `yash@chhattisgarhluxestudios.com` | `password123` |
| Chhattisgarh Luxe Studios | Nikhil Barber | `8000000023` | `nikhil@chhattisgarhluxestudios.com` | `password123` |
| Chhattisgarh Luxe Studios | Krishna Barber | `8000000024` | `krishna@chhattisgarhluxestudios.com` | `password123` |
| Chhattisgarh Luxe Studios | Varun Barber | `8000000025` | `varun@chhattisgarhluxestudios.com` | `password123` |
| Goa Signature Salon | Kabir Barber | `8000000026` | `kabir@goasignaturesalon.com` | `password123` |
| Goa Signature Salon | Harsh Barber | `8000000027` | `harsh@goasignaturesalon.com` | `password123` |
| Goa Signature Salon | Ravi Barber | `8000000028` | `ravi@goasignaturesalon.com` | `password123` |
| Goa Signature Salon | Shaurya Barber | `8000000029` | `shaurya@goasignaturesalon.com` | `password123` |
| Goa Signature Salon | Rajesh Barber | `8000000030` | `rajesh@goasignaturesalon.com` | `password123` |
| Gujarat Imperial Hair Care | Ajay Barber | `8000000031` | `ajay@gujaratimperialhaircare.com` | `password123` |
| Gujarat Imperial Hair Care | Yash Barber | `8000000032` | `yash@gujaratimperialhaircare.com` | `password123` |
| Gujarat Imperial Hair Care | Aman Barber | `8000000033` | `aman@gujaratimperialhaircare.com` | `password123` |
| Gujarat Imperial Hair Care | Kabir Barber | `8000000034` | `kabir@gujaratimperialhaircare.com` | `password123` |
| Gujarat Imperial Hair Care | Sameer Barber | `8000000035` | `sameer@gujaratimperialhaircare.com` | `password123` |
| Haryana Grand Grooming | Abhishek Barber | `8000000036` | `abhishek@haryanagrandgrooming.com` | `password123` |
| Haryana Grand Grooming | Varun Barber | `8000000037` | `varun@haryanagrandgrooming.com` | `password123` |
| Haryana Grand Grooming | Prakash Barber | `8000000038` | `prakash@haryanagrandgrooming.com` | `password123` |
| Haryana Grand Grooming | Vikram Barber | `8000000039` | `vikram@haryanagrandgrooming.com` | `password123` |
| Haryana Grand Grooming | Harsh Barber | `8000000040` | `harsh@haryanagrandgrooming.com` | `password123` |
| Himachal Pradesh Royal Grooming | Gaurav Barber | `8000000041` | `gaurav@himachalpradeshroyalgrooming.com` | `password123` |
| Himachal Pradesh Royal Grooming | Vihaan Barber | `8000000042` | `vihaan@himachalpradeshroyalgrooming.com` | `password123` |
| Himachal Pradesh Royal Grooming | Ishaan Barber | `8000000043` | `ishaan@himachalpradeshroyalgrooming.com` | `password123` |
| Himachal Pradesh Royal Grooming | Sanjay Barber | `8000000044` | `sanjay@himachalpradeshroyalgrooming.com` | `password123` |
| Himachal Pradesh Royal Grooming | Vikram Barber | `8000000045` | `vikram@himachalpradeshroyalgrooming.com` | `password123` |
| Jharkhand Elite Cuts | Arjun Barber | `8000000046` | `arjun@jharkhandelitecuts.com` | `password123` |
| Jharkhand Elite Cuts | Sai Barber | `8000000047` | `sai@jharkhandelitecuts.com` | `password123` |
| Jharkhand Elite Cuts | Vihaan Barber | `8000000048` | `vihaan@jharkhandelitecuts.com` | `password123` |
| Jharkhand Elite Cuts | Deepak Barber | `8000000049` | `deepak@jharkhandelitecuts.com` | `password123` |
| Jharkhand Elite Cuts | Vikram Barber | `8000000050` | `vikram@jharkhandelitecuts.com` | `password123` |
| Karnataka Classic Stylists | Varun Barber | `8000000051` | `varun@karnatakaclassicstylists.com` | `password123` |
| Karnataka Classic Stylists | Pranav Barber | `8000000052` | `pranav@karnatakaclassicstylists.com` | `password123` |
| Karnataka Classic Stylists | Gaurav Barber | `8000000053` | `gaurav@karnatakaclassicstylists.com` | `password123` |
| Karnataka Classic Stylists | Abhishek Barber | `8000000054` | `abhishek@karnatakaclassicstylists.com` | `password123` |
| Karnataka Classic Stylists | Harsh Barber | `8000000055` | `harsh@karnatakaclassicstylists.com` | `password123` |
| Kerala Barbershop Lounge | Manish Barber | `8000000056` | `manish@keralabarbershoplounge.com` | `password123` |
| Kerala Barbershop Lounge | Rahul Barber | `8000000057` | `rahul@keralabarbershoplounge.com` | `password123` |
| Kerala Barbershop Lounge | Vihaan Barber | `8000000058` | `vihaan@keralabarbershoplounge.com` | `password123` |
| Kerala Barbershop Lounge | Arjun Barber | `8000000059` | `arjun@keralabarbershoplounge.com` | `password123` |
| Kerala Barbershop Lounge | Sameer Barber | `8000000060` | `sameer@keralabarbershoplounge.com` | `password123` |
| Madhya Pradesh Luxe Studios | Rajesh Barber | `8000000061` | `rajesh@madhyapradeshluxestudios.com` | `password123` |
| Madhya Pradesh Luxe Studios | Amit Barber | `8000000062` | `amit@madhyapradeshluxestudios.com` | `password123` |
| Madhya Pradesh Luxe Studios | Karan Barber | `8000000063` | `karan@madhyapradeshluxestudios.com` | `password123` |
| Madhya Pradesh Luxe Studios | Aman Barber | `8000000064` | `aman@madhyapradeshluxestudios.com` | `password123` |
| Madhya Pradesh Luxe Studios | Abhishek Barber | `8000000065` | `abhishek@madhyapradeshluxestudios.com` | `password123` |
| Maharashtra Signature Salon | Piyush Barber | `8000000066` | `piyush@maharashtrasignaturesalon.com` | `password123` |
| Maharashtra Signature Salon | Alok Barber | `8000000067` | `alok@maharashtrasignaturesalon.com` | `password123` |
| Maharashtra Signature Salon | Reyansh Barber | `8000000068` | `reyansh@maharashtrasignaturesalon.com` | `password123` |
| Maharashtra Signature Salon | Rohan Barber | `8000000069` | `rohan@maharashtrasignaturesalon.com` | `password123` |
| Maharashtra Signature Salon | Aditya Barber | `8000000070` | `aditya@maharashtrasignaturesalon.com` | `password123` |
| Manipur Imperial Hair Care | Sanjay Barber | `8000000071` | `sanjay@manipurimperialhaircare.com` | `password123` |
| Manipur Imperial Hair Care | Sunil Barber | `8000000072` | `sunil@manipurimperialhaircare.com` | `password123` |
| Manipur Imperial Hair Care | Rohan Barber | `8000000073` | `rohan@manipurimperialhaircare.com` | `password123` |
| Manipur Imperial Hair Care | Reyansh Barber | `8000000074` | `reyansh@manipurimperialhaircare.com` | `password123` |
| Manipur Imperial Hair Care | Amit Barber | `8000000075` | `amit@manipurimperialhaircare.com` | `password123` |
| Meghalaya Grand Grooming | Sandeep Barber | `8000000076` | `sandeep@meghalayagrandgrooming.com` | `password123` |
| Meghalaya Grand Grooming | Amit Barber | `8000000077` | `amit@meghalayagrandgrooming.com` | `password123` |
| Meghalaya Grand Grooming | Pranav Barber | `8000000078` | `pranav@meghalayagrandgrooming.com` | `password123` |
| Meghalaya Grand Grooming | Sai Barber | `8000000079` | `sai@meghalayagrandgrooming.com` | `password123` |
| Meghalaya Grand Grooming | Sanjay Barber | `8000000080` | `sanjay@meghalayagrandgrooming.com` | `password123` |
| Mizoram Royal Grooming | Vikram Barber | `8000000081` | `vikram@mizoramroyalgrooming.com` | `password123` |
| Mizoram Royal Grooming | Aman Barber | `8000000082` | `aman@mizoramroyalgrooming.com` | `password123` |
| Mizoram Royal Grooming | Abhishek Barber | `8000000083` | `abhishek@mizoramroyalgrooming.com` | `password123` |
| Mizoram Royal Grooming | Amit Barber | `8000000084` | `amit@mizoramroyalgrooming.com` | `password123` |
| Mizoram Royal Grooming | Harsh Barber | `8000000085` | `harsh@mizoramroyalgrooming.com` | `password123` |
| Nagaland Elite Cuts | Sandeep Barber | `8000000086` | `sandeep@nagalandelitecuts.com` | `password123` |
| Nagaland Elite Cuts | Sai Barber | `8000000087` | `sai@nagalandelitecuts.com` | `password123` |
| Nagaland Elite Cuts | Shaurya Barber | `8000000088` | `shaurya@nagalandelitecuts.com` | `password123` |
| Nagaland Elite Cuts | Vikrant Barber | `8000000089` | `vikrant@nagalandelitecuts.com` | `password123` |
| Nagaland Elite Cuts | Sameer Barber | `8000000090` | `sameer@nagalandelitecuts.com` | `password123` |
| Odisha Classic Stylists | Alok Barber | `8000000091` | `alok@odishaclassicstylists.com` | `password123` |
| Odisha Classic Stylists | Aarav Barber | `8000000092` | `aarav@odishaclassicstylists.com` | `password123` |
| Odisha Classic Stylists | Sameer Barber | `8000000093` | `sameer@odishaclassicstylists.com` | `password123` |
| Odisha Classic Stylists | Manish Barber | `8000000094` | `manish@odishaclassicstylists.com` | `password123` |
| Odisha Classic Stylists | Piyush Barber | `8000000095` | `piyush@odishaclassicstylists.com` | `password123` |
| Punjab Barbershop Lounge | Sunil Barber | `8000000096` | `sunil@punjabbarbershoplounge.com` | `password123` |
| Punjab Barbershop Lounge | Sameer Barber | `8000000097` | `sameer@punjabbarbershoplounge.com` | `password123` |
| Punjab Barbershop Lounge | Vikrant Barber | `8000000098` | `vikrant@punjabbarbershoplounge.com` | `password123` |
| Punjab Barbershop Lounge | Vikram Barber | `8000000099` | `vikram@punjabbarbershoplounge.com` | `password123` |
| Punjab Barbershop Lounge | Karan Barber | `8000000100` | `karan@punjabbarbershoplounge.com` | `password123` |
| Rajasthan Luxe Studios | Piyush Barber | `8000000101` | `piyush@rajasthanluxestudios.com` | `password123` |
| Rajasthan Luxe Studios | Arjun Barber | `8000000102` | `arjun@rajasthanluxestudios.com` | `password123` |
| Rajasthan Luxe Studios | Deepak Barber | `8000000103` | `deepak@rajasthanluxestudios.com` | `password123` |
| Rajasthan Luxe Studios | Harsh Barber | `8000000104` | `harsh@rajasthanluxestudios.com` | `password123` |
| Rajasthan Luxe Studios | Rohan Barber | `8000000105` | `rohan@rajasthanluxestudios.com` | `password123` |
| Sikkim Signature Salon | Kabir Barber | `8000000106` | `kabir@sikkimsignaturesalon.com` | `password123` |
| Sikkim Signature Salon | Vijay Barber | `8000000107` | `vijay@sikkimsignaturesalon.com` | `password123` |
| Sikkim Signature Salon | Sunil Barber | `8000000108` | `sunil@sikkimsignaturesalon.com` | `password123` |
| Sikkim Signature Salon | Amit Barber | `8000000109` | `amit@sikkimsignaturesalon.com` | `password123` |
| Sikkim Signature Salon | Prakash Barber | `8000000110` | `prakash@sikkimsignaturesalon.com` | `password123` |
| Tamil Nadu Imperial Hair Care | Aditya Barber | `8000000111` | `aditya@tamilnaduimperialhaircare.com` | `password123` |
| Tamil Nadu Imperial Hair Care | Vikrant Barber | `8000000112` | `vikrant@tamilnaduimperialhaircare.com` | `password123` |
| Tamil Nadu Imperial Hair Care | Sanjay Barber | `8000000113` | `sanjay@tamilnaduimperialhaircare.com` | `password123` |
| Tamil Nadu Imperial Hair Care | Rohan Barber | `8000000114` | `rohan@tamilnaduimperialhaircare.com` | `password123` |
| Tamil Nadu Imperial Hair Care | Ravi Barber | `8000000115` | `ravi@tamilnaduimperialhaircare.com` | `password123` |
| Telangana Grand Grooming | Aditya Barber | `8000000116` | `aditya@telanganagrandgrooming.com` | `password123` |
| Telangana Grand Grooming | Vikram Barber | `8000000117` | `vikram@telanganagrandgrooming.com` | `password123` |
| Telangana Grand Grooming | Rahul Barber | `8000000118` | `rahul@telanganagrandgrooming.com` | `password123` |
| Telangana Grand Grooming | Reyansh Barber | `8000000119` | `reyansh@telanganagrandgrooming.com` | `password123` |
| Telangana Grand Grooming | Varun Barber | `8000000120` | `varun@telanganagrandgrooming.com` | `password123` |
| Tripura Royal Grooming | Harsh Barber | `8000000121` | `harsh@tripuraroyalgrooming.com` | `password123` |
| Tripura Royal Grooming | Aditya Barber | `8000000122` | `aditya@tripuraroyalgrooming.com` | `password123` |
| Tripura Royal Grooming | Ishaan Barber | `8000000123` | `ishaan@tripuraroyalgrooming.com` | `password123` |
| Tripura Royal Grooming | Karan Barber | `8000000124` | `karan@tripuraroyalgrooming.com` | `password123` |
| Tripura Royal Grooming | Alok Barber | `8000000125` | `alok@tripuraroyalgrooming.com` | `password123` |
| Uttar Pradesh Elite Cuts | Ravi Barber | `8000000126` | `ravi@uttarpradeshelitecuts.com` | `password123` |
| Uttar Pradesh Elite Cuts | Aarav Barber | `8000000127` | `aarav@uttarpradeshelitecuts.com` | `password123` |
| Uttar Pradesh Elite Cuts | Piyush Barber | `8000000128` | `piyush@uttarpradeshelitecuts.com` | `password123` |
| Uttar Pradesh Elite Cuts | Deepak Barber | `8000000129` | `deepak@uttarpradeshelitecuts.com` | `password123` |
| Uttar Pradesh Elite Cuts | Sanjay Barber | `8000000130` | `sanjay@uttarpradeshelitecuts.com` | `password123` |
| Uttarakhand Classic Stylists | Amit Barber | `8000000131` | `amit@uttarakhandclassicstylists.com` | `password123` |
| Uttarakhand Classic Stylists | Anil Barber | `8000000132` | `anil@uttarakhandclassicstylists.com` | `password123` |
| Uttarakhand Classic Stylists | Rahul Barber | `8000000133` | `rahul@uttarakhandclassicstylists.com` | `password123` |
| Uttarakhand Classic Stylists | Sameer Barber | `8000000134` | `sameer@uttarakhandclassicstylists.com` | `password123` |
| Uttarakhand Classic Stylists | Prakash Barber | `8000000135` | `prakash@uttarakhandclassicstylists.com` | `password123` |
| West Bengal Barbershop Lounge | Rajesh Barber | `8000000136` | `rajesh@westbengalbarbershoplounge.com` | `password123` |
| West Bengal Barbershop Lounge | Sandeep Barber | `8000000137` | `sandeep@westbengalbarbershoplounge.com` | `password123` |
| West Bengal Barbershop Lounge | Sai Barber | `8000000138` | `sai@westbengalbarbershoplounge.com` | `password123` |
| West Bengal Barbershop Lounge | Reyansh Barber | `8000000139` | `reyansh@westbengalbarbershoplounge.com` | `password123` |
| West Bengal Barbershop Lounge | Aman Barber | `8000000140` | `aman@westbengalbarbershoplounge.com` | `password123` |
| The Royal Touch Salon | Ali (Master Stylist) | `8888888801` | `` | `password123` |


---

## ⚠️ Notes

- `.env` file is NOT in repo — create it manually
- `node_modules` is NOT in repo — run `npm install`
- Need **VPN**  for MongoDB connection
- First time only — run `node createTestData.js` in Backend folder

## 📁 Folder Structure

```
BarberAutomation-SaaS/
│
├── Backend/                          # Express + Mongoose API
│   ├── models/                       # Mongoose schemas
│   │   ├── Admin.js
│   │   ├── Barber.js
│   │   ├── Booking.js
│   │   ├── BreakRequest.js
│   │   ├── Customer.js
│   │   ├── OtpStore.js
│   │   ├── Payment.js
│   │   ├── Queue.js
│   │   ├── Reminder.js
│   │   ├── Review.js
│   │   ├── Salon.js
│   │   └── Service.js
│   ├── routes/                       # API endpoints
│   │   ├── authRoutes.js
│   │   ├── salonRoutes.js
│   │   ├── barberRoutes.js
│   │   ├── ownerRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── queueRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── reminderRoutes.js
│   │   ├── noshowRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── breakRoutes.js
│   ├── middleware/                   # Auth & validation
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── paymentVerificationMiddleware.js
│   │   └── razorpayWebhookMiddleware.js
│   ├── controllers/                  # Business logic
│   │   ├── paymentController.js
│   │   └── revenueController.js
│   ├── services/                     # External integrations
│   │   └── razorpayService.js
│   ├── utils/
│   │   ├── apiError.js
│   │   └── asyncHandler.js
│   └── server.js                     # Entry point
│
└── Frontend/                         # React + Vite + Tailwind
    ├── public/                       # Static assets
    │   ├── favicon.svg
    │   └── icons.svg
    │
    └── src/
        ├── App.jsx                   # Root component & routes
        ├── App.css
        ├── main.jsx                  # Entry point
        ├── index.css
        │
        ├── assets/                   # Images & static media
        │
        ├── components/               # Reusable UI components
        │   ├── admin/                # Admin-specific widgets
        │   │   └── Sidebar.jsx
        │   ├── booking/              # Booking flow components
        │   │   ├── BookingForm.jsx
        │   │   ├── ConfirmationPage.jsx
        │   │   ├── SearchFilterHeader.jsx
        │   │   ├── ServiceSummary.jsx
        │   │   └── SlotSelection.jsx
        │   ├── common/               # Atomic building blocks
        │   │   ├── Atoms.jsx
        │   │   ├── FormAtoms.jsx
        │   │   ├── Modals.jsx
        │   │   └── StatusBadge.jsx
        │   ├── customer/             # Customer-shared components
        │   │   ├── CustomerCard.jsx
        │   │   └── DetailPanel.jsx
        │   ├── layout/               # Page chrome
        │   │   ├── Footer.jsx
        │   │   └── Navbar.jsx
        │   ├── membership/
        │   │   └── MembershipSection.jsx
        │   ├── queue/
        │   │   ├── NearbyBarbers.jsx
        │   │   └── NoShowDelayPage.jsx
        │   ├── reviews/
        │   │   └── ReviewSystem.jsx
        │   └── salon/
        │       └── SalonDetailPage.jsx
        │
        ├── pages/                    # Route-level pages
        │   ├── HomePage.jsx
        │   ├── admin/
        │   │   ├── AdminLogin.jsx
        │   │   ├── AdminOnboarding.jsx
        │   │   ├── SalonManagement.jsx
        │   │   └── SalonViewPage.jsx
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   ├── Signup.jsx
        │   │   ├── Register.jsx
        │   │   ├── OTPLogin.jsx
        │   │   ├── OTPVerify.jsx
        │   │   ├── StaffLogin.jsx
        │   │   ├── Payment.jsx
        │   │   ├── CustomerProfile.jsx
        │   │   ├── DuplicateAccount.jsx
        │   │   └── RateLimit.jsx
        │   ├── barber/
        │   │   ├── BarberDashboard.jsx
        │   │   ├── BarberLogin.jsx
        │   │   ├── BarberProfile.jsx
        │   │   ├── BreakManagement.jsx
        │   │   ├── NoShowHandle.jsx
        │   │   ├── QueuePage.jsx
        │   │   ├── ServiceConsole.jsx
        │   │   └── ServiceHandler.jsx
        │   ├── customer/
        │   │   ├── AddonServices.jsx
        │   │   ├── AllReviews.jsx
        │   │   ├── BarberSelection.jsx
        │   │   ├── Booking.jsx
        │   │   ├── BookingHistory.jsx
        │   │   ├── CustomerBookingFlow.jsx
        │   │   ├── CustomerDetails.jsx
        │   │   ├── CustomerInteractionView.jsx
        │   │   ├── CustomerManagement.jsx
        │   │   ├── MenServices.jsx
        │   │   ├── ReminderSystem.jsx
        │   │   ├── ServiceCategories.jsx
        │   │   ├── SmartQueue.jsx
        │   │   ├── UserNotification.jsx
        │   │   └── WomenServices.jsx
        │   └── owner/
        │       ├── AnalyticsDashboard.jsx
        │       ├── BookingManagement.jsx
        │       ├── BreakApprovalDashboard.jsx
        │       ├── FinancePage.jsx
        │       ├── HomeOverview.jsx
        │       ├── LiveQueue.jsx
        │       ├── ManageServices.jsx
        │       ├── OwnerDashboard.jsx
        │       ├── OwnerLogin.jsx
        │       ├── PaymentDashboard.jsx
        │       ├── RevenueDashboard.jsx
        │       ├── SalonRegistration.jsx
        │       └── SettingsPage.jsx
        │
        ├── contexts/                 # React Context providers
        │   └── AppContext.jsx
        │
        ├── config/                   # Constants & static data
        │   └── data.js
        │
        ├── utils/                    # Helper functions
        │   └── razorpay.js
        │
        └── styles/                   # Global CSS
            ├── smart-queue.css
            └── theme.css
```
