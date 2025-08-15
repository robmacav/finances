class Category < ApplicationRecord
    validates_presence_of :summary, :icon

    belongs_to :user, class_name: 'User', foreign_key: 'user_id'
    has_many :incomes, class_name: 'Income', foreign_key: 'category_id', dependent: :destroy
    has_many :expenses, class_name: 'Expense', foreign_key: 'category_id', dependent: :destroy

    def as_json(options = {})
        {
            id: id,
            summary: summary,
            color: color
        }
    end

    private

    before_create do
        self.color = SecureRandom.hex(3)
    end
end
