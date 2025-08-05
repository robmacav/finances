class SupaTransaction < ApplicationRecord
  self.table_name = 'transactions'

  establish_connection Rails.configuration.database_configuration['supa']
end