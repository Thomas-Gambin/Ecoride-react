/**
 * Représentation mock alignée sur le schéma PostgreSQL (entités Symfony).
 * @see Ecoride-symfony/src/Entity/Carpool.php
 * @see Ecoride-symfony/src/Entity/Car.php
 * @see Ecoride-symfony/src/Entity/User.php
 * @see Ecoride-symfony/src/Enum/CarEnergy.php
 */

/** Valeurs stockées en base sur `car.energy` */
export type CarEnergyDb = "essence" | "diesel" | "hybride" | "electrique"

/** Statut métier du covoiturage (`carpool.status`, varchar 50) */
export type CarpoolStatusDb = "open" | "full" | "completed" | "cancelled"

export type CarpoolDriverMock = {
  /** `user.id` */
  userId: number
  /** `user.username` (pseudo affiché) */
  username: string
  /** Moyenne dérivée des avis Mongo `carpool_reviews` / profil */
  averageRating: number
}

export type CarpoolCarMock = {
  /** `brand.label` via relation `car.brand` */
  brandLabel: string
  /** `car.model` */
  model: string
  /** `car.energy` */
  energy: CarEnergyDb
  /** `car.color` */
  color: string
}

/**
 * Enregistrement source pour un covoiturage.
 * `arrivalTime` et `durationMinutes` ne sont pas en colonnes `carpool` :
 * ils seront calculés côté API ou dérivés pour l’affichage (comme `TripSnapshot` Mongo).
 */
export type CarpoolMockRecord = {
  /** `carpool.id` */
  id: number
  /** `carpool.departure_date` */
  departureDate: string
  /** Heure extraite de `carpool.departure_time` */
  departureTime: string
  /** `carpool.departure_location` */
  departureLocation: string
  /** `carpool.arrival_date` */
  arrivalDate: string
  /** `carpool.arrival_location` */
  arrivalLocation: string
  /** `carpool.status` */
  status: CarpoolStatusDb
  /**
   * `carpool.seat_count` — places passagers encore disponibles.
   * (À l’intégration API : total − réservations sur la table de jointure `carpool` ↔ `user`.)
   */
  seatCount: number
  /** `carpool.price_per_person` (crédits) */
  pricePerPerson: number
  driver: CarpoolDriverMock
  car: CarpoolCarMock
  /** Passagers déjà inscrits (`carpool` ↔ `user`), hors conducteur */
  bookedPassengerCount: number
  /** Dérivé pour l’UI tant que l’API n’expose pas `arrival_time` */
  arrivalTime: string
  durationMinutes: number
}
