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
- [x] Planning the expenses you want in a given month, making it possible to allocate expenses and categorize them.
- [ ] Registration of sources of income acquired over the months and years.
- [ ] Write-off of separate expenses (debit card, physical cash) and those linked to credit/credit cards.
- [ ] Register credit cards, installment plans and configure limits, closing and expiration dates.
- [ ] Monthly balance of expenses, income acquired in the month and money and available credit / installment limits.

## How to Run
```bash
docker build -f Dockerfile.dev -t finances_app_dev .
```
```bash
docker run -p 3000:3000 -v .:/app finances_app 
```

## Credits
This project is mainly built with [webpixels](https://webpixels.io/), [Bootstrap](https://getbootstrap.com/), [Bootstrap Icons](https://icons.getbootstrap.com/) and some other wonderful tools. 

## License
This project is published under [MIT License](docs/LICENSE).