class DeleteUsersJob < ApplicationJob
    queue_as :default
  
    def perform
      User.where(status: 'Solicitado Exclusão').destroy_all
    end
  end