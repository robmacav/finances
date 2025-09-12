class Lei < ApplicationRecord
    self.table_name = "LEI"

    belongs_to :categoria, foreign_key: 'categoria', primary_key: 'categorias'
end