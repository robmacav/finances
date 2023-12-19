class User < ApplicationRecord
    devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable
    has_many :plannings, dependent: :destroy
    has_many :tags, dependent: :destroy
    has_many :cards, dependent: :destroy
    has_many :expense_categories, dependent: :destroy
    has_many :expenses, dependent: :destroy
    has_many :revenue, dependent: :destroy
    
    validates_presence_of :first_name, :last_name
    validates_presence_of :email, uniqueness: true

    enum status: { 
        'Ativo': nil, 
        'Solicitado Exclusão': 1 
    }
    
    def fullname
        "#{self.first_name} #{self.last_name}"
    end
end
