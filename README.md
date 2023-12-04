<div align="center">

  # Financial Manager

  An application to manage finances.

![Ruby](https://img.shields.io/badge/version-3.0.1-brightgreen?logo=ruby&label=Ruby&labelColor=%23CC342D&color=%235D5D5D)&nbsp;
![RubyOnRails](https://img.shields.io/badge/version-7.0.4-brightgreen?logo=rubyonrails&label=RubyOnRails&labelColor=%23D30001&color=%235D5D5D)&nbsp;
![PostgreSQL](https://img.shields.io/badge/version-16.1-brightgreen?logo=postgresql&logoColor=white&label=PostgreSQL&labelColor=%234169E1&color=%235D5D5D)&nbsp;
![Redis](https://img.shields.io/badge/version-7.2-brightgreen?logo=redis&logoColor=white&label=Redis&labelColor=%23DC382D&color=%235D5D5D)&nbsp;
![Digital Ocean](https://img.shields.io/badge/VPS-brightgreen?logo=digitalocean&logoColor=white&label=Digital%20Ocean&labelColor=%230080FF&color=%235D5D5D)&nbsp;

</p>

  ![Devices Mockup](docs/images/planning.png)
  <!-- ![Devices Mockup](docs/images/schema.png) -->
</div>

## Features
- Income planning and expense categorization.
- Registration of revenues over the months and years.
- Record of expenses + payment method.
- Card registration.
- Monthly balance of expenses, income and available credit and cash limits.

## How to Run
```bash
docker build -f Dockerfile.dev -t finances_app_dev .
```
```bash
docker run -p 3000:3000 -v .:/app finances_app_dev
```
