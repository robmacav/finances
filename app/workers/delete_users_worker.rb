class DeleteUsersWorker
    def initialize
        @users = User.where(status: 'Solicitado Exclusão')
    end

    def call
        @users.destroy_all
    end
end