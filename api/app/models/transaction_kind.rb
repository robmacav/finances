class TransactionKind < ApplicationRecord
    validates_presence_of :summary
end