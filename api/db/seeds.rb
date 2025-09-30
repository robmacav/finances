User.find_or_create_by!(email: "dev@example.com") do |u|
  u.first_name = "Dev"
  u.last_name = "X"
  u.email = "robmacav@gmail.com"
  u.password = "b7b6287cce"
end