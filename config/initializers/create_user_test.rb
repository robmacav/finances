# Rails.application.config.after_initialize do
#     if Rails.env.development?
#         User.find_or_create_by(email: 'explorer@finances.me') do |user|
#         user.first_name = 'Sr.'
#         user.last_name = 'Finances'
#         user.password = '111111'
#         end
#     end
# end
