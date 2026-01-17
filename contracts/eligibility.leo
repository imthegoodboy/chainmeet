// ChainMeet - Eligibility Verification Contract
// Handles ZK proof verification for meeting eligibility rules

program eligibility.aleo {
    // Eligibility proof structure
    struct EligibilityProof {
        proof_id: u64,
        meeting_id: u64,
        rule_type: u8, // 0: NFT, 1: Token, 2: DAO, 3: Custom
        proof_hash: field,
        verified: bool,
    }

    // Private record for eligibility verification
    record EligibilityRecord {
        owner: address.private,
        proof_id: u64.private,
        meeting_id: u64.private,
        rule_type: u8.private,
        verification_key: field.private,
    }

    // Public mappings
    mapping proofs: u64 => EligibilityProof;
    mapping meeting_eligibility: u64 => u64; // meeting_id => proof_id
    mapping user_eligibility: address => u64; // user => proof_id

    // Verify NFT ownership proof (without revealing NFT ID)
    transition verify_nft_ownership(
        meeting_id: u64,
        nft_contract_hash: field,
        ownership_proof: field,
        min_balance: u64
    ) -> EligibilityRecord {
        // Verify the proof (simplified - in production use proper ZK verification)
        // The proof should demonstrate ownership without revealing the NFT ID
        let proof_valid = verify_proof(ownership_proof, nft_contract_hash, min_balance);
        
        if (proof_valid) {
            let proof_id: u64 = 0u64; // Get next proof ID
            
            let proof = EligibilityProof {
                proof_id: proof_id,
                meeting_id: meeting_id,
                rule_type: 0u8,
                proof_hash: ownership_proof,
                verified: true,
            };

            set proofs[proof_id] => proof;
            set meeting_eligibility[meeting_id] => proof_id;

            let verification_key = hash_to_field(ownership_proof, meeting_id);
            return EligibilityRecord {
                owner: caller,
                proof_id: proof_id,
                meeting_id: meeting_id,
                rule_type: 0u8,
                verification_key: verification_key,
            };
        } else {
            return EligibilityRecord {
                owner: caller,
                proof_id: 0u64,
                meeting_id: meeting_id,
                rule_type: 0u8,
                verification_key: 0field,
            };
        }
    }

    // Verify token balance proof (without revealing exact amount)
    transition verify_token_balance(
        meeting_id: u64,
        token_contract_hash: field,
        balance_proof: field,
        min_balance: u64
    ) -> EligibilityRecord {
        // Verify the proof demonstrates minimum balance without revealing exact amount
        let proof_valid = verify_proof(balance_proof, token_contract_hash, min_balance);
        
        if (proof_valid) {
            let proof_id: u64 = 0u64;
            
            let proof = EligibilityProof {
                proof_id: proof_id,
                meeting_id: meeting_id,
                rule_type: 1u8,
                proof_hash: balance_proof,
                verified: true,
            };

            set proofs[proof_id] => proof;
            set meeting_eligibility[meeting_id] => proof_id;

            let verification_key = hash_to_field(balance_proof, meeting_id);
            return EligibilityRecord {
                owner: caller,
                proof_id: proof_id,
                meeting_id: meeting_id,
                rule_type: 1u8,
                verification_key: verification_key,
            };
        } else {
            return EligibilityRecord {
                owner: caller,
                proof_id: 0u64,
                meeting_id: meeting_id,
                rule_type: 1u8,
                verification_key: 0field,
            };
        }
    }

    // Verify DAO membership proof (without revealing identity)
    transition verify_dao_membership(
        meeting_id: u64,
        dao_contract_hash: field,
        membership_proof: field
    ) -> EligibilityRecord {
        // Verify DAO membership without revealing member identity
        let proof_valid = verify_proof(membership_proof, dao_contract_hash, 0u64);
        
        if (proof_valid) {
            let proof_id: u64 = 0u64;
            
            let proof = EligibilityProof {
                proof_id: proof_id,
                meeting_id: meeting_id,
                rule_type: 2u8,
                proof_hash: membership_proof,
                verified: true,
            };

            set proofs[proof_id] => proof;
            set meeting_eligibility[meeting_id] => proof_id;

            let verification_key = hash_to_field(membership_proof, meeting_id);
            return EligibilityRecord {
                owner: caller,
                proof_id: proof_id,
                meeting_id: meeting_id,
                rule_type: 2u8,
                verification_key: verification_key,
            };
        } else {
            return EligibilityRecord {
                owner: caller,
                proof_id: 0u64,
                meeting_id: meeting_id,
                rule_type: 2u8,
                verification_key: 0field,
            };
        }
    }

    // Verify custom rule proof
    transition verify_custom_rule(
        meeting_id: u64,
        rule_hash: field,
        custom_proof: field
    ) -> EligibilityRecord {
        // Verify custom rule proof
        let proof_valid = verify_proof(custom_proof, rule_hash, 0u64);
        
        if (proof_valid) {
            let proof_id: u64 = 0u64;
            
            let proof = EligibilityProof {
                proof_id: proof_id,
                meeting_id: meeting_id,
                rule_type: 3u8,
                proof_hash: custom_proof,
                verified: true,
            };

            set proofs[proof_id] => proof;
            set meeting_eligibility[meeting_id] => proof_id;

            let verification_key = hash_to_field(custom_proof, meeting_id);
            return EligibilityRecord {
                owner: caller,
                proof_id: proof_id,
                meeting_id: meeting_id,
                rule_type: 3u8,
                verification_key: verification_key,
            };
        } else {
            return EligibilityRecord {
                owner: caller,
                proof_id: 0u64,
                meeting_id: meeting_id,
                rule_type: 3u8,
                verification_key: 0field,
            };
        }
    }

    // Check if user is eligible for a meeting
    function check_eligibility(meeting_id: u64, user: address) -> bool {
        let proof_id = meeting_eligibility[meeting_id];
        let user_proof_id = user_eligibility[user];
        
        if (proof_id == user_proof_id) {
            let proof = proofs[proof_id];
            return proof.verified;
        }
        return false;
    }

    // Helper function to verify proofs (simplified)
    function verify_proof(proof: field, contract_hash: field, threshold: u64) -> bool {
        // In production, this would use proper ZK proof verification
        // For now, simplified check
        return proof != 0field;
    }

    // Helper function to hash proof and meeting_id
    function hash_to_field(proof: field, meeting_id: u64) -> field {
        return proof + field(meeting_id);
    }
}
