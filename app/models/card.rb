class Card < ApplicationRecord
    belongs_to :user

    scope :all_by_current_user, ->(id) { where(user_id: id) }

    def limit_decimal_to_float
        if limit.present? 
            formatted = format('%.2f', self.limit).tr('.', ',')
        
            parts = formatted.split(',')
            parts[0] = parts[0].reverse.scan(/\d{1,3}/).join('.').reverse
        
            parts.join(',')
        end
    end

    def self.ransackable_attributes(auth_object = nil)
        ["description", "limit"]
    end
end
