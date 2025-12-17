package com.ordering.menuservice.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
@Table(name = "menu_items")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;

    private String description;
    @Column(nullable = false)
    private BigDecimal price;

    private String category;
    private String imageUrl;
    private boolean available = true;
    @CreationTimestamp
    private LocalDateTime createdAt ;
    @UpdateTimestamp
    private LocalDateTime updatedAt ;
}
