class ProdTransaction < ApplicationRecord
  self.table_name = 'transactions'
  establish_connection Rails.configuration.database_configuration['production']
end