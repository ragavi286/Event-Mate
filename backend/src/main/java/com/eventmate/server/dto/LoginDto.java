package com.eventmate.server.dto;

// Using 'record' automatically creates fields, constructor, and accessor methods (e.g., email(), password())
public record LoginDto(String email, String password) {
}
