package com.ecommerce.dto.response;

import com.ecommerce.model.enums.Role;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private Role role;

    public AuthResponse() {}
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private AuthResponse r = new AuthResponse();
        public Builder token(String v) { r.token = v; return this; }
        public Builder type(String v) { r.type = v; return this; }
        public Builder id(Long v) { r.id = v; return this; }
        public Builder name(String v) { r.name = v; return this; }
        public Builder email(String v) { r.email = v; return this; }
        public Builder role(Role v) { r.role = v; return this; }
        public AuthResponse build() { return r; }
    }
}