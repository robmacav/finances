user = User.new(first_name: "Robson", last_name: "Cavalcante")

user.income.new(description: "SEFIN", value: 3563, date: 26102024)

user.cards.new(description: "Will", limit: 1540)
user.cards.new(description: "Banco do Brasil", limit: 14277)

user.expense_categories.new(description: "Serviços", color: SecureRandom.hex(3))
user.expense_categories.new(description: "Transporte", color: SecureRandom.hex(3))
user.expense_categories.new(description: "Supermercado", color: SecureRandom.hex(3))

user.expenses.new(description: "Assai Atacadista", value: 90, date: 26102024)
user.expenses.new(description: "META 21", value: 35, date: 26102024)
user.expenses.new(description: "Energisa", value: 479)
user.expenses.new(description: "Olla Telecom", value: 99.90)

user.save