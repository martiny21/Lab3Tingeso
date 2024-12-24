package com.example.demo.controllers;

import com.example.demo.entities.RequestEntity;
import com.example.demo.services.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin("*")
public class RequestController {
    @Autowired
    RequestService requestService;

    @GetMapping("/{userId}/status")
    public short getRequestStatus(@PathVariable Long userId) {
        return requestService.getRequestStatus(userId);
    }

    @GetMapping("/allRequests")
    public List<RequestEntity> getAllRequests() {
        return requestService.getAllRequests();
    }

    @PostMapping("/{userId}/make")
    public ResponseEntity<RequestEntity> makeRequest(@RequestBody RequestEntity request, @PathVariable Long userId) {
        try {
            RequestEntity newRequest = requestService.makeRequest(request, userId);
            return ResponseEntity.ok(newRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{userId}/evaluate")
    public ResponseEntity<RequestEntity> evaluateRequest(@PathVariable Long userId) {
        try {
            RequestEntity request = requestService.evaluateRequest(userId);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{userId}/update")
    public ResponseEntity<RequestEntity> updateRequest(@PathVariable Long userId, @RequestParam short status) {
        try {
            RequestEntity request = requestService.updateRequest(userId, status);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{userId}/request")
    public RequestEntity getRequest(@PathVariable Long userId) {
        return requestService.getRequest(userId);
    }*
}
