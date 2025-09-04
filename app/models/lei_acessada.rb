class LeiAcessada < ApplicationRecord
    self.table_name = "LEIS_ACESSADAS"

    belongs_to :lei,
             class_name: "Lei",
             foreign_key: "lei",   # coluna em LEIS_ACESSADAS
             primary_key: "lei",   # coluna em LEI
             optional: true

end