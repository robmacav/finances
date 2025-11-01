FactoryBot.define do
  factory :transaction do
    summary { "Pagamento de serviço" }
    value   { 250.75 }
    date    { Date.today }
  end
end
