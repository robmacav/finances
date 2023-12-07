every 1.day do
    DeleteUsersJob.perform_later
end