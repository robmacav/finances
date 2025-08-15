class Status < ApplicationRecord
    def as_json(options = {})
        {
            id: id, 
            summary: summary        
        }
    end
end
