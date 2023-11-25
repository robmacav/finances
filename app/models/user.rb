class User < ApplicationRecord
    has_many :plannings, dependent: :destroy
    
    validates_presence_of :first_name, :last_name
end
